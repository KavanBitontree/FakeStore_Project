type onSearch = (value: string) => void;

type SearchIconProps = {
  size?: number;
  className?: string;
};

type SearchProps = {
  onSearch: onSearch;
  placeholder?: string;
};

export { SearchProps, SearchIconProps, onSearch };
