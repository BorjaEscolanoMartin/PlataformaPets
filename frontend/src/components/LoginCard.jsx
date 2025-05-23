return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1594677421857-f47b74e9e04e?auto=format&fit=crop&w=1470&q=80')",
      }}
    >
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl w-full max-w-md shadow-2xl text-white">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <span className="text-indigo-400 text-xl font-bold flex items-center gap-2">
            <span className="text-3xl">🟦</span> ShipX
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center">Welcome to ShipX</h1>
        <p className="text-sm text-gray-300 text-center mt-1">
          AI powered inventory management software
        </p>

        {/* Social Buttons */}
        <div className="mt-6 space-y-3">
          <button className="w-full flex items-center justify-center gap-3 bg-white/10 border border-white/20 rounded-full py-2 text-sm text-white hover:bg-white/20 transition">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              alt="Google"
              className="h-5 w-5"
            />
            Continue with Google
          </button>
          <button className="w-full flex items-center justify-center gap-3 bg-white/10 border border-white/20 rounded-full py-2 text-sm text-white hover:bg-white/20 transition">
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M16.365 1.43c0 1.14-.93 2.058-2.068 2.058-1.147 0-2.077-.918-2.077-2.058C12.22.293 13.15-.632 14.297-.632c1.138 0 2.068.926 2.068 2.062M24 16.612c-.175 3.18-2.82 7.25-6.435 7.25-1.296 0-2.246-.84-3.47-.84-1.24 0-2.263.825-3.487.825-3.6 0-6.473-6.23-6.473-10.27 0-4.47 2.888-6.82 5.718-6.82 1.26 0 2.33.88 3.11.88.77 0 2.11-.92 3.62-.92 1.67 0 3.37.96 4.31 2.6-3.78 2.21-3.14 7.9.61 8.57z" />
            </svg>
            Continue with Apple
          </button>
        </div>

        {/* Separator */}
        <div className="flex items-center gap-4 my-6">
          <hr className="flex-grow border-gray-600" />
          <span className="text-sm text-gray-400">or</span>
          <hr className="flex-grow border-gray-600" />
        </div>

        {/* Email input */}
        <div className="mb-4">
          <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2">
            <svg
              className="h-4 w-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M4 4h16v16H4V4zm2 4l6 4 6-4" />
            </svg>
            <input
              type="email"
              defaultValue="helloshivani24@gmail.com"
              className="bg-transparent outline-none text-white text-sm flex-1"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {/* Submit button */}
        <button className="w-full bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full py-2 font-semibold">
          Continue with email
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{" "}
          <a href="#" className="text-white font-medium hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );