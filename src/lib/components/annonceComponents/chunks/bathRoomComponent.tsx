interface roomCountProps {
    value: number;
    size?: number;
}

export default function BathRoomComponent({ value, size = 20 }: roomCountProps) {
    return (
        <div className="flex w-fit flex-col items-start justify-center gap-3">
            <svg
                preserveAspectRatio="xMidYMid meet"
                data-bbox="28.932 28.931 143.122 142.137"
                viewBox="28.932 28.931 143.122 142.137"
                height={size}
                width={size}
                xmlns="http://www.w3.org/2000/svg"
                role="presentation"
                aria-hidden="true"
                className="fill-current text-gray-300">
                <g>
                    <path d="M47.107 111.33l11.498 51.738H36.932V36.932h18.14l4.775 12.734 7.49-2.809-6.723-17.926H28.932v142.137H158.78l13.274-59.738H47.107zm105.255 51.738H66.801L57.08 119.33h105.002l-9.72 43.738z" />
                </g>
            </svg>

            <p className="font-oswald text-sm text-gray-500">SdB</p>
            <p className="font-black">{value}</p>
        </div>
    );
}
