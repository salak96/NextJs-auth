import {
    db
    } from "@/app/lib/db";
    import {
    NextResponse
    } from "next/server";
    import {
    hash
    } from "bcrypt";
    
    //post
    export async function POST(request: Request) {
        try {
            const body = await request.json();
            const {
                email,
                username,
                password
            } = body;
    
            //check if email ready
            const exitstingUserByEmail = await db.user.findUnique({
                where: {
                    email: email
                }
            })
    
            if (exitstingUserByEmail) {
                return NextResponse.json({
                    user: null,
                    message: "Email already exists"
                }, {
                    status: 409
                })
            }
            //check if username ready
            const exitstingUserByUsername = await db.user.findUnique({
                where: {
                    username: username
                }
            })
    
            if (exitstingUserByUsername) {
                return NextResponse.json({
                    user: null,
                    message: "Username already exists"
                }, {
                    status: 409
                })
            }
    
            //hash password
            const hashedPassword = await hash(password, 10)
            //send to db
            const newUser = await db.user.create({
                data: {
                    email,
                    username,
                    password: hashedPassword
                }
            })
            const { password: newUserPassword, ...res } = newUser
            return NextResponse.json({
                user: res,
                message: "User created"
            }, {
                status: 200
            })
    
        } catch (err) {
            return NextResponse.json({
                message: "Internal Server Error",
                status : 500
            })
        }
    }