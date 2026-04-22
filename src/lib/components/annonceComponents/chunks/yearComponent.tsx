interface roomCountProps {
    value: number;
    size?: number;
}

export default function YearComponent({ value, size = 20 }: roomCountProps) {
    return (
        <div className="flex w-fit flex-col items-start justify-center gap-3">
            <svg
                preserveAspectRatio="xMidYMid meet"
                data-bbox="30.439 30.57 138.859 138.86"
                viewBox="30.439 30.57 138.859 138.86"
                height={size}
                width={size}
                xmlns="http://www.w3.org/2000/svg"
                data-type="color"
                role="presentation"
                aria-hidden="true"
                className="fill-current text-gray-300">
                <g>
                    <path d="M30.439 30.57v138.86h138.859V30.57H30.439zm130.859 8v37.907h-18.755V53.198h-28.811v23.279H86.246V53.198H57.435v23.279H38.439V38.57h122.859zm-26.755 84.508h-12.811v-15.386h12.811v15.386zm-20.81-23.386v23.386H86.246V99.692H57.435v23.386H38.439v-38.6h122.859v38.601h-18.755V99.692h-28.81zm-35.487 23.386H65.435v-15.386h12.811v15.386zm0-46.6H65.435v-15.28h12.811v15.28zm56.297 0h-12.811v-15.28h12.811v15.28zM38.439 161.43v-30.352h122.859v30.352H38.439z"></path>
                </g>
            </svg>

            <p className="font-oswald text-sm text-gray-500">Année</p>
            <p className="font-black">{value}</p>
        </div>
    );
}
