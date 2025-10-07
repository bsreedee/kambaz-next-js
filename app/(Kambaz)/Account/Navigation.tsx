"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import "../styles.css";

export default function AccountNavigation() {
    const pathname = usePathname();
    
    const links = [{ href: "Signin", id: "wd-signin-link", label: "SignIn" },
    { href: "Signup", id: "wd-signup-link", label: "SignUp" },
    { href: "Profile", id: "wd-profile-link", label: "Profile" }]
    return (
        <div id="wd-profile-navigation" className="wd list-group-account-item fs-5 rounded-0">
            {links.map((link) => {
                    const isActive = pathname === `/Account/${link.href}`;

                    return (
                    <Link
                        key={link.id}
                        href={link.href}
                        id={link.id}
                        className={`d-flex align-items-center text-decoration-none py-2 px-3 ${
                        isActive ? "text-black" : "text-danger" 
                        }`}
                    >
                        <div
                        className={`me-2 ${
                            isActive ? "bg-black" : ""
                        }`}
                        style={{
                            width: "3px",
                            height: "24px",
                            borderRadius: "2px",
                        }}
                        />
                        {link.label}
                    </Link>
                    );
                })}
                </div>
            );
            }