const NotFound = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex items-center gap-4">
        <h1 className="text-5xl font-semibold">404</h1>
        <div className="border h-10 mt-2"></div>
        <p className="mt-1">Page Not Found</p>
      </div>
    </div>
  );
};

export default NotFound;
