import { NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import StreamModel from '@/src/models/Stream';
import ClassModel from '@/src/models/Class'; // Isko import karna zaroori hai populate ke liye

// 1. Get all streams
export async function GET() {
  try {
    await dbConnect();
    // populate('classId', 'name') se class ki ID ke badle uska pura naam nikal aayega
    const streams = await StreamModel.find({}).populate('classId', 'name').sort({ createdAt: -1 });
    return NextResponse.json({ streams }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// 2. Create a new stream
export async function POST(request: Request) {
  try {
    await dbConnect();
    const { name, classId } = await request.json();

    if (!name || !classId) {
      return NextResponse.json({ message: 'Stream name and Class are required' }, { status: 400 });
    }

    const newStream = await StreamModel.create({ name, classId });
    return NextResponse.json({ message: 'Stream created successfully', stream: newStream }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// 3. Update a stream
export async function PUT(request: Request) {
  try {
    await dbConnect();
    const { id, name, classId } = await request.json();

    if (!id || !name || !classId) {
      return NextResponse.json({ message: 'ID, Name, and Class are required' }, { status: 400 });
    }

    const updatedStream = await StreamModel.findByIdAndUpdate(
      id, 
      { name, classId }, 
      { new: true }
    );
    
    return NextResponse.json({ message: 'Stream updated', stream: updatedStream }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// 4. Delete a stream
export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Stream ID is required' }, { status: 400 });
    }

    await StreamModel.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Stream deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}