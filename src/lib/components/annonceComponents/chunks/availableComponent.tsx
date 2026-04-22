interface roomCountProps {
    value: string;
    size?: number;
}

export default function AvailableComponent({ value, size = 20 }: roomCountProps) {
    return (
        <div className="flex w-fit flex-col items-start justify-center gap-3">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1920 1920"
                width={size}
                height={size}
                className="fill-current text-gray-300"
                aria-hidden="true">
                <path
                    d="M1827.701 303.065 698.835 1431.801 92.299 825.266 0 917.564 698.835 1616.4 1919.869 395.234z"
                    fillRule="evenodd"
                />
            </svg>

            <p className="font-oswald text-sm text-gray-500">Disponnible</p>
            <p className="font-black">{value}</p>
        </div>
    );
}
