interface roomCountProps {
    value: number;
    size?: number;
}

export default function RoomCountComponent({ value, size = 20 }: roomCountProps) {
    return (
        <div className="flex w-fit flex-col items-start justify-center gap-3">
            <svg
                preserveAspectRatio="xMidYMid meet"
                data-bbox="30.57 30.57 138.86 138.86"
                viewBox="30.57 30.57 138.86 138.86"
                height={size}
                width={size}
                xmlns="http://www.w3.org/2000/svg"
                data-type="color"
                role="presentation"
                aria-hidden="true"
                className="fill-current text-gray-300">
                <g>
                    <path d="M30.57 30.57v138.86h138.86V30.57H30.57zm130.86 130.86H38.57V38.57h122.86v122.86z" />
                    <path d="M87.175 112.825h-41.65v41.649h41.649v-41.649zm-8 33.65h-25.65v-25.649h25.649v25.649z" />
                </g>
            </svg>
            <p className="font-oswald text-sm text-gray-500">m²</p>
            <p className="font-black">{value}</p>
        </div>
    );
}
