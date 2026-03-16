import { NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import ClassModel from '@/src/models/Class';

// 1. Saari classes fetch karna (GET)
export async function GET() {
  try {
    await dbConnect();
    const classes = await ClassModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ classes }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// 2. Nayi class add karna (POST)
export async function POST(request: Request) {
  try {
    await dbConnect();
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ message: 'Class name is required' }, { status: 400 });
    }

    const existingClass = await ClassModel.findOne({ name });
    if (existingClass) {
      return NextResponse.json({ message: 'Class already exists' }, { status: 409 });
    }

    const newClass = await ClassModel.create({ name });
    return NextResponse.json({ message: 'Class created successfully', class: newClass }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// 3. Class ka naam update karna (PUT)
export async function PUT(request: Request) {
  try {
    await dbConnect();
    const { id, name } = await request.json();

    if (!id || !name) {
      return NextResponse.json({ message: 'ID and Name are required' }, { status: 400 });
    }

    const updatedClass = await ClassModel.findByIdAndUpdate(id, { name }, { new: true });
    return NextResponse.json({ message: 'Class updated', class: updatedClass }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// 4. Class delete karna (DELETE)
export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Class ID is required' }, { status: 400 });
    }

    await ClassModel.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Class deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}