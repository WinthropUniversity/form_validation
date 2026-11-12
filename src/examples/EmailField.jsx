// Slide 5. A controlled input on its own, with the value printed underneath
// so you can see the state change as you type.
//
// Nothing in the app imports this. To look at it, open src/App.jsx and swap
// SignUpForm for EmailField.

import { useState } from "react";

export default function EmailField() {
  const [email, setEmail] = useState("");
  return (
    <>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <p>You typed: {email}</p>
    </>
  );
}
