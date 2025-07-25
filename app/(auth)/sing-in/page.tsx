"use client";

import { useState } from "react";
import Link from "next/link";

// import { Container } from "./styles";

export default function Page() {
  const [item, setItem] = useState(null);

  return (
    <div>
      <p>Page</p>
      <Link href="/">Home</Link>
    </div>
  );
}
