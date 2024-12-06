export default function Title({ title }: { title: string }) {
  return (
    <div>
      <div className="border-l-[5px] my-5 border-main pl-3">
        <h2 className="mb-2 text-xl md:text-2xl font-semibold text-dark">
          {title}
        </h2>
      </div>
    </div>
  );
}
