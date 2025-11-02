function ProductCardSkeleton() {
  return (
    <div className="group relative animate-pulse">
      <div className="relative">
        <div className="aspect-square w-full rounded-md bg-gray-300 lg:aspect-auto lg:h-80" />
        <div className="mt-4 flex justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </div>
        <div className="mt-3 flex gap-2">
          <div className="flex-1 h-10 bg-gray-200 rounded-md"></div>
          <div className="flex-1 h-10 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}

export default ProductCardSkeleton;

