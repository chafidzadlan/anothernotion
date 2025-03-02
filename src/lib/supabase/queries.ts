"use server";

import db from "./db";

export const findUser = async (userId: string) => {
    const response = await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.id, userId),
    });
    return response;
};