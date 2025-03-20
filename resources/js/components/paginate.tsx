import { Link } from "@inertiajs/react";
import React from "react";
import { router } from "@inertiajs/react";

interface Link {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: Link[];
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ links, currentPage, setCurrentPage }) => {
    const handlePageChange = (url: string) => {
        const pageParam = new URL(url).searchParams.get('page');
        setCurrentPage(pageParam ? parseInt(pageParam, 10) : 1);
        router.get(url);
    }
    return (
        <nav className="flex justify-center  mb-6">
            {links.map(link => (
                <Link
                key={link.label}
                    onClick={(e)=>{
                        e.preventDefault();
                        if (link.url) {
                            handlePageChange(link.url);
                        }
                    }}
                    preserveScroll
                    href={link.url || ""}
                    className={`flex items-center justify-center px-3 py-2 text-sm rounded-lg text-gray-600 
                        ${link.active ? "bg-gray-200" : ""} 
                        ${!link.url ? "text-gray-300 pointer-events-none" : ""}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </nav>
    );
};

export default Pagination;
