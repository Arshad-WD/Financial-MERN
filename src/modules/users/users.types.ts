export type Role = "viewer" | "analyst" | "admin";

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    status: "active" | "inactive";
    createdAt: Date;
    updatedAt: Date;
}