import ChatInterface from "@/components/chat-interface";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const Home = () => {
  return (
    <main className="">
      <header className="border-b">
        <div className="container flex items-center justify-between mx-auto p-2">
          <div>
            <h1>Python Coding Tutor</h1>
          </div>
          <div>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>
      <div className="container px-2 mx-auto">
        <ChatInterface />
      </div>
    </main>
  );
};

export default Home;
