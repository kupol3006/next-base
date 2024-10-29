import { auth } from "../auth";


export default async function Home() {
  const session = await auth();
  console.log("check session", session);
  return (
    <div>
      <div>{JSON.stringify(session)}</div>
      <h1>Home</h1>
    </div>
  );
}
