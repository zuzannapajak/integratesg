// "use client";

// import { createProfile } from "@/features/auth/actions";
// import { SelfServiceRole } from "@/lib/auth/roles";
// import { createClient } from "@/lib/supabase/client";
// import { useState } from "react";

// type RegisterFormProps = {
//   role: SelfServiceRole;
// };

// export default function RegisterForm({ role }: RegisterFormProps) {
//   const supabase = createClient();

//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleRegister = async (e: React.SyntheticEvent) => {
//     e.preventDefault();
//     setMessage(null);
//     setIsSubmitting(true);

//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: {
//           role,
//           full_name: fullName,
//         },
//       },
//     });

//     if (error) {
//       setMessage(error.message);
//       setIsSubmitting(false);
//       return;
//     }

//     if (data.user?.id && data.user.email) {
//       try {
//         await createProfile({
//           userId: data.user.id,
//           email: data.user.email,
//           role,
//           fullName: fullName || null,
//         });
//       } catch {
//         setMessage("Account created, but the profile could not be saved.");
//         setIsSubmitting(false);
//         return;
//       }
//     }

//     setMessage("Account created successfully. Check your email to continue.");
//     setIsSubmitting(false);
//   };

//   return (
//     <form onSubmit={handleRegister} className="space-y-4">
//       <div className="space-y-2">
//         <label htmlFor="fullName" className="text-[0.93rem] font-medium text-[#31425a]">
//           Full name
//         </label>
//         <input
//           id="fullName"
//           type="text"
//           placeholder="Enter your full name"
//           className="min-h-13 w-full rounded-2xl border border-[#d7dee8] bg-white px-4 text-[#31425a] outline-none transition focus:border-[#9fb4ca] focus:ring-4 focus:ring-[#dfeaf5]"
//           value={fullName}
//           onChange={(e) => {
//             setFullName(e.target.value);
//           }}
//         />
//       </div>

//       <div className="space-y-2">
//         <label htmlFor="email" className="text-[0.93rem] font-medium text-[#31425a]">
//           Email
//         </label>
//         <input
//           id="email"
//           type="email"
//           placeholder="Enter your email"
//           className="min-h-13 w-full rounded-2xl border border-[#d7dee8] bg-white px-4 text-[#31425a] outline-none transition focus:border-[#9fb4ca] focus:ring-4 focus:ring-[#dfeaf5]"
//           value={email}
//           onChange={(e) => {
//             setEmail(e.target.value);
//           }}
//           required
//         />
//       </div>

//       <div className="space-y-2">
//         <label htmlFor="password" className="text-[0.93rem] font-medium text-[#31425a]">
//           Password
//         </label>
//         <input
//           id="password"
//           type="password"
//           placeholder="Create a password"
//           className="min-h-13 w-full rounded-2xl border border-[#d7dee8] bg-white px-4 text-[#31425a] outline-none transition focus:border-[#9fb4ca] focus:ring-4 focus:ring-[#dfeaf5]"
//           value={password}
//           onChange={(e) => {
//             setPassword(e.target.value);
//           }}
//           required
//         />
//       </div>

//       <button
//         type="submit"
//         disabled={isSubmitting}
//         className="inline-flex min-h-13 w-full items-center justify-center rounded-full bg-[#31425a] px-4 font-semibold text-white transition hover:bg-[#243246] disabled:cursor-not-allowed disabled:opacity-70"
//       >
//         {isSubmitting ? "Creating account..." : "Create account"}
//       </button>

//       {message && <p className="text-sm leading-6 text-[#5f6c7b]">{message}</p>}
//     </form>
//   );
// }
