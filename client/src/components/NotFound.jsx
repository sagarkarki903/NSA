const NotFound = () => {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-red-500">404</h1>
          <p className="mt-4 text-2xl font-semibold text-gray-800">Page Not Found</p>
          <p className="mt-2 text-gray-600">
            Oops! The page you’re looking for doesn’t exist.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 mt-6 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
          >
            Go Back Home
          </a>
        </div>
      </div>
    );
  };
  
  export default NotFound;
  