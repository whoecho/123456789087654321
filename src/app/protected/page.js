"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ProtectedPage() {
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/");

    axios
      .get("http://localhost:4000/protected", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMessage(res.data.message))
      .catch(() => router.push("/"));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Protected Page</h2>
      <p>{message}</p>
    </div>
  );
}
