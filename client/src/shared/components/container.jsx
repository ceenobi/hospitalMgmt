export default function Container({ classname, children }) {
  return (
    <div className={`container pt-20 md:pt-28 pb-6 px-4 mx-auto ${classname}`}>
      {children}
    </div>
  );
}
