import { NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import SubjectModel from '@/src/models/Subject';
import ClassModel from '@/src/models/Class';
import StreamModel from '@/src/models/Stream';

// 1. Get all subjects
export async function GET() {
  try {
    await dbConnect();
    // Populate se hume Class ka naam, uska stream status, aur Stream ka naam mil jayega
    const subjects = await SubjectModel.find({})
      .populate('classId', 'name hasStream')
      .populate('streamId', 'name')
      .sort({ createdAt: -1 });
      
    return NextResponse.json({ subjects }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// 2. Create a new subject
export async function POST(request: Request) {
  try {
    await dbConnect();
    const { name, classId, streamId } = await request.json();

    if (!name || !classId) {
      return NextResponse.json({ message: 'Subject name and Class are required' }, { status: 400 });
    }

    // Agar streamId khali hai (jaise Class 10 ke liye), toh use save mat karo
    const newSubject = await SubjectModel.create({ 
      name, 
      classId, 
      streamId: streamId || undefined 
    });
    
    return NextResponse.json({ message: 'Subject created successfully', subject: newSubject }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// 3. Update a subject
export async function PUT(request: Request) {
  try {
    await dbConnect();
    const { id, name, classId, streamId } = await request.json();

    if (!id || !name || !classId) {
      return NextResponse.json({ message: 'ID, Name, and Class are required' }, { status: 400 });
    }

    const updatedSubject = await SubjectModel.findByIdAndUpdate(
      id, 
      { name, classId, streamId: streamId || undefined }, 
      { new: true }
    );
    
    return NextResponse.json({ message: 'Subject updated', subject: updatedSubject }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// 4. Delete a subject
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