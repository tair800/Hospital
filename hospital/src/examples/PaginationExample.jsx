import React, { useState, useEffect } from 'react';
import Pagination from '../components/Pagination';
import usePagination from '../hooks/usePagination';

// Example: How to use the pagination system in any page
const ExamplePage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Use the pagination hook
    const {
        currentPage,
        totalPages,
        currentItems,
        startIndex,
        endIndex,
        handlePageChange,
        handlePreviousPage,
        handleNextPage,
        resetPagination
    } = usePagination(data, 6); // 6 items per page

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Replace with your API call
                const response = await fetch('your-api-endpoint');
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Reset pagination when data changes
    useEffect(() => {
        resetPagination();
    }, [data, resetPagination]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="example-page">
            <h1>Example Page with Pagination</h1>

            {/* Your content grid/list */}
            <div className="content-grid">
                {currentItems.map((item, index) => (
                    <div key={item.id || index} className="content-item">
                        {/* Your item content */}
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                    </div>
                ))}
            </div>

            {/* Pagination Component */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
                startIndex={startIndex}
                endIndex={endIndex}
                totalItems={data.length}
                itemsPerPage={6}
                showInfo={true}
                className="example-pagination"
            />
        </div>
    );
};

export default ExamplePage;

/* 
USAGE INSTRUCTIONS:

1. Import the components:
   import Pagination from '../components/Pagination';
   import usePagination from '../hooks/usePagination';

2. Use the hook in your component:
   const {
       currentPage,
       totalPages,
       currentItems,
       startIndex,
       endIndex,
       handlePageChange,
       handlePreviousPage,
       handleNextPage,
       resetPagination
   } = usePagination(yourDataArray, itemsPerPage);

3. Replace your data mapping with currentItems:
   {currentItems.map((item, index) => (
       // Your item JSX
   ))}

4. Add the Pagination component:
   <Pagination
       currentPage={currentPage}
       totalPages={totalPages}
       onPageChange={handlePageChange}
       onPreviousPage={handlePreviousPage}
       onNextPage={handleNextPage}
       startIndex={startIndex}
       endIndex={endIndex}
       totalItems={yourDataArray.length}
       itemsPerPage={itemsPerPage}
       showInfo={true}
       className="your-custom-class"
   />

5. Optional: Reset pagination when data changes:
   useEffect(() => {
       resetPagination();
   }, [yourDataArray, resetPagination]);

PROPS EXPLANATION:
- currentPage: Current active page number
- totalPages: Total number of pages
- onPageChange: Function to handle page number clicks
- onPreviousPage: Function to handle previous button
- onNextPage: Function to handle next button
- startIndex: Starting index of current page items
- endIndex: Ending index of current page items
- totalItems: Total number of items
- itemsPerPage: Number of items per page (default: 9)
- showInfo: Show/hide pagination info text (default: true)
- className: Additional CSS class for styling (default: "")
*/
