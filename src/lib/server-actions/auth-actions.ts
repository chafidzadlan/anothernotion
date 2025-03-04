"use server";

import { z } from "zod";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { FormSchema } from "../types";
import { cookies } from "next/headers";

export async function actionSignUpUser({
    email,
    password,
}: z.infer<typeof FormSchema>) {
    const supabase = createRouteHandlerClient({ cookies });
    const { data, error: queryError } = await supabase.from("profiles").select("*").eq("email", email);

    if (queryError) {
        return { error: { message: "Error checking existing user", details: queryError }};
    }

    if (Array.isArray(data) && data.length > 0) {
        return { error: { message: "User already exists", data } };
    }

    const response = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}api/auth/callback`,
        },
    });
    return response;
};