const BoxesList = ({ boxes }) => {
  return (
    <div>
      <div className=" my-6 grid gap-1 grid-cols-2  md:grid-cols-3 lg:grid-cols-5">
        {boxes.map((item) => {
          return (
            <article className="overflow-hidden rounded-lg  transition-all border-4 border-transparent duration-300 hover:-translate-y-2.5 hover:border-slate-600">
              <img
                alt="img praying"
                className="h-[150px] w-full object-cover"
                src={item.img}
              />

              <div className="p-2 bg-[#333]">
                <h3 className=" text-lg  mb-4 ">{item.name}</h3>
                <h2 className="text-6xl font-bold ">{item.time}</h2>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default BoxesList;
