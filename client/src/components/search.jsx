import { RiSearchLine } from "@remixicon/react";
import {
  useSearchParams,
  useNavigation,
  useSubmit,
  useNavigate,
  Form,
} from "react-router";
import { useRef } from "react";
import useSearch from "@/hooks/useSearch";
import { useDebouncedCallback } from "use-debounce";

export default function Search({ id, children }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef(null);
  const navigation = useNavigation();
  const navigate = useNavigate();
  const submit = useSubmit();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("query");
  const query = searchParams.get("query") || null;
  useSearch({
    inputRef,
    searchParams,
    setSearchParams,
    navigate,
    query,
  });

  const debouncedSubmit = useDebouncedCallback((event) => {
    const isFirstSearch = query === null;
    submit(event.currentTarget, {
      replace: !isFirstSearch,
    });
  }, 500);

  return (
    <>
      <div className="flex justify-between items-center md:gap-2 w-full md:w-auto">
        <Form
          role="search"
          id={id}
          onChange={(event) => {
            debouncedSubmit(event.currentTarget);
          }}
        >
          <label className="input max-w-[220px]">
            {searching ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              <RiSearchLine className="text-gray-500" />
            )}
            <input
              type="search"
              className="w-full grow"
              placeholder="Search"
              name="query"
              aria-label="Search"
              defaultValue={query}
              ref={inputRef}
            />
          </label>
        </Form>
        {children}
      </div>
    </>
  );
}
