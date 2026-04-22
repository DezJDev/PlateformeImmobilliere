interface roomCountProps {
    value: number;
    size?: number;
}

export default function FloorComponent({ value, size = 20 }: roomCountProps) {
    return (
        <div className="flex w-fit flex-col items-start justify-center gap-3">
            <svg
                preserveAspectRatio="xMidYMid meet"
                data-bbox="34.57 31.149 130.859 137.702"
                viewBox="34.57 31.149 130.859 137.702"
                height={size}
                width={size}
                xmlns="http://www.w3.org/2000/svg"
                data-type="color"
                role="presentation"
                aria-hidden="true"
                className="fill-current text-gray-300">
                <g>
                    <path d="M165.429 160.851v8H34.57v-8h130.859z" />
                    <path d="M165.429 96v8H34.57v-8h130.859z" />
                    <path d="M165.429 31.149v8H34.57v-8h130.859z" />
                    <path d="M99.663 52.766v8H46.557v-8h53.106z" />
                    <path d="M119.685 74.383v8H66.579v-8h53.106z" />
                    <path d="M157.872 117.617v8h-53.106v-8h53.106z" />
                    <path d="M133.106 139.234v8H80v-8h53.106z" />
                </g>
            </svg>

            <p className="font-oswald text-sm text-gray-500">Etages</p>
            <p className="font-black">{value}</p>
        </div>
    );
}
