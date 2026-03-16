import { NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import User from '@/src/models/User';

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { name, email, firebaseUID } = body;

    if (!name || !email || !firebaseUID) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Email ya Firebase UID se check karo ki user pehle se hai kya
    const existingUser = await User.findOne({
      $or: [{ email: email }, { firebaseUID: firebaseUID }]
    });

    if (existingUser) {
      // FIX: Yahan pehle 409 tha, isliye console mein laal error aata tha.
      // Ab hum isko 200 (OK) bhejenge, kyunki purana user login kar raha hai, jo ki success hai!
      return NextResponse.json({ message: 'User already exists, logged in successfully', user: existingUser }, { status: 200 });
    }

    const newUser = await User.create({
      name,
      email,
      firebaseUID,
    });

    return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
}