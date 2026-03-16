import { NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import PaymentModel from '@/src/models/Payment';
import UserModel from '@/src/models/User';

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    // Frontend se user ka Firebase UID aur Subject ID aayega
    const { firebaseUID, subjectId, amount } = await request.json();

    if (!firebaseUID || !subjectId || amount === undefined) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // 1. Firebase UID se MongoDB mein User ko dhoondho
    const user = await UserModel.findOne({ firebaseUID });
    if (!user) {
      return NextResponse.json({ message: 'User not found in database' }, { status: 404 });
    }

    // 2. Check karo ki kya is student ne yeh subject pehle se kharida hua hai?
    const existingPayment = await PaymentModel.findOne({ 
      userId: user._id, 
      subjectId: subjectId,
      status: 'completed'
    });

    if (existingPayment) {
      return NextResponse.json({ message: 'You have already purchased this subject' }, { status: 409 });
    }

    // 3. Nayi Payment Create karo
    const newPayment = await PaymentModel.create({
      userId: user._id,
      subjectId: subjectId,
      amount: Number(amount),
      status: 'completed', // Real gateway lagane par ise pehle 'pending' rakhte hain
    });

    return NextResponse.json({ message: 'Payment successful', payment: newPayment }, { status: 201 });

  } catch (error: any) {
    console.error("Payment API Error:", error);
    return NextResponse.json({ message: error.message || 'Payment processing failed' }, { status: 500 });
  }
}