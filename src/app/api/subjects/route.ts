import { NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import SubjectModel from '@/src/models/Subject';

// 1. Saare subjects fetch karna (GET)
export async function GET() {
  try {
    await dbConnect();
    const subjects = await SubjectModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ subjects }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// 2. Naya subject add karna (POST)
export async function POST(request: Request) {
  try {
    await dbConnect();
    const { classId, name, price, pdfUrl } = await request.json();

    if (!classId || !name || price === undefined) {
      return NextResponse.json({ message: 'Class, Name, and Price are required' }, { status: 400 });
    }

    const newSubject = await SubjectModel.create({ 
      classId, 
      name, 
      price: Number(price), 
      pdfUrl: pdfUrl || "" 
    });
    
    return NextResponse.json({ message: 'Subject created successfully', subject: newSubject }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// 3. Subject delete karna (DELETE)
export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Subject ID is required' }, { status: 400 });
    }

    await SubjectModel.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Subject deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}