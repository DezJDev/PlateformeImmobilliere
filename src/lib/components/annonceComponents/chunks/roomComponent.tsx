interface roomCountProps {
    value: number;
    size?: number;
}

export default function RoomCountComponent({ value, size = 20 }: roomCountProps) {
    return (
        <div className="flex flex-col w-fit items-start justify-center gap-3">
            <svg
                preserveAspectRatio="xMidYMid meet"
                data-bbox="28.153 28.153 143.693 143.693"
                viewBox="28.153 28.153 143.693 143.693"
                height={size}
                width={size}
                xmlns="http://www.w3.org/2000/svg"
                data-type="color"
                role="presentation"
                aria-hidden="true"
                className="fill-current text-gray-300">
                <g>
                    <path d="M28.153 28.153v143.693h143.693V28.153H28.153zm135.694 8v44.339H36.153V36.153h127.694zM36.153 163.847V88.492h127.693v75.354H36.153z"></path>
                    <path d="M96.246 41.723H43.661v31.262h52.585V41.723zm-8 23.261H51.661V49.723h36.585v15.261z"></path>
                    <path d="M156.339 41.723h-52.585v31.262h52.585V41.723zm-8 23.261h-36.585V49.723h36.585v15.261z"></path>
                </g>
            </svg>
            <p className="text-sm font-oswald text-gray-500">Chambres</p>
            <p className="font-black">{value}</p>
            
        </div>
    );
}
