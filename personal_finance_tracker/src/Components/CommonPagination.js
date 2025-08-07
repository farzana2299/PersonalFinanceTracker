import { Pagination } from 'react-bootstrap';

function CommonPagination({ currentPage, totalPages, onPageChange }) {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <Pagination size="sm" className="justify-content-center mt-3">
            {pageNumbers.map((page) => (
                <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </Pagination.Item>
            ))}
        </Pagination>
    );
}

export default CommonPagination;