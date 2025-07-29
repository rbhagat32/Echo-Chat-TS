const NotFound = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex items-center gap-4">
        <h1 className="text-5xl font-semibold">404</h1>
        <div className="mt-2 h-10 border"></div>
        <p className="mt-1">Page Not Found</p>
      </div>
    </div>
  );
};

export default NotFound;
