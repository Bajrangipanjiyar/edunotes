import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import dbConnect from '@/src/lib/mongodb';
import SubjectModel from '@/src/models/Subject';

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    // Frontend se FormData receive kar rahe hain
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const subjectId = formData.get('subjectId') as string;

    if (!file || !subjectId) {
      return NextResponse.json({ message: 'File and Subject ID are required' }, { status: 400 });
    }

    // File ko buffer mein convert karna (Cloudinary ko stream upload ke liye chahiye hota hai)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Cloudinary par upload karna (Promise ka use karke)
    const uploadResult: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          resource_type: 'raw', // PDFs aur documents ke liye 'raw' use hota hai
          folder: 'edunotes_pdfs' // Cloudinary mein is folder mein save hoga
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      // Upload process start
      uploadStream.end(buffer);
    });

    // Jab upload ho jaye, toh MongoDB mein Subject ko naye PDF URL ke sath update kar do
    const updatedSubject = await SubjectModel.findByIdAndUpdate(
      subjectId,
      { pdfUrl: uploadResult.secure_url },
      { new: true }
    );

    return NextResponse.json({ 
      message: 'PDF uploaded successfully', 
      url: uploadResult.secure_url 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ message: error.message || 'Upload failed' }, { status: 500 });
  }
}