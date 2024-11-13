import React, { useEffect, useState } from 'react'
import './Deals.css'
import DealCreate from '../DealCreate/DealCreate';
import Popup from 'reactjs-popup';
import { FiSearch } from 'react-icons/fi';
import { fetchDealsData } from '../../api/data';
import DealCard from '../Deal-Card/DealCard';
import CustomDropdown from '../CustomDropdown/CustomDropdown';

const Deals =  () => {
   const [deals,setDeals]=useState(null);
   
   const [search, setSearch] = useState("");
   
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const [isLoading, setIsloading] = useState(false);
   const [isBlurred, setIsBlurred] = useState(false);
    const [filter, setFilter] = useState("");
    
   const handleSearchChange = (e) => {
     const value = e.target.value;
     setSearch(value);
     setCurrentPage(1); 
     loadDealData(1, filter, value); 
   };
   const handleFilterChange = (dealType) => {
     setFilter(dealType);
     setCurrentPage(1);
     loadDealData(1, dealType, search);
   };

   const loadDealData = async (
     page = 1,
     dealType = filter,
     companyName = search
   ) => {
     setIsloading(true);
     try {
       
       const result = await fetchDealsData({ page, dealType, companyName });
       if (result) {
         setDeals(result.data);
         setTotalPages(result.totalPages);
       }
     } catch (error) {
       console.error("Error fetching user data:", error);
     } finally {
       setIsloading(false);
     }
   };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    useEffect(() => {
        loadDealData(currentPage);
    }, [currentPage]);

  return (
    <div
      className={`promotions-container ${isBlurred ? "blur-background" : ""}`}
    >
      <div className="header">
        <div className="h-deal">
          <h2>Deals</h2>
          <Popup
            contentStyle={{ marginBottom: "5vh" }}
            trigger={
              <div className="deal">
                <p>Post a Deal</p>
              </div>
            }
            modal
            closeOnDocumentClick={false}
            onOpen={() => setIsBlurred(true)}
            onClose={() => setIsBlurred(false)}
          >
            {(close) => <DealCreate close={close} />}
          </Popup>
        </div>

        <div className="searchfilter">
          <div className="search">
            <form onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="search" className="field">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  name="search"
                  id="search"
                  placeholder="Search Deals"
                  value={search}
                  onChange={handleSearchChange}
                />
              </label>
            </form>
          </div>
          <div className="all-filter">
            <div
              className="all"
              onClick={() => {
                handleFilterChange("");
                setCurrentPage(1);
                setFilter(null);
                setSearch("");
              }}
            >
              <p>ALL</p>
            </div>
            <Popup
              trigger={
                <div className="filter">
                  <p>Filter</p>
                </div>
              }
            >
              {(close) => (
                <div className="filter-options">
                  <CustomDropdown
                    options={["Commission", "Barter", "Paid", "Job"]}
                    onSelect={(value) => {
                      handleFilterChange(value);
                      close();
                    }}
                  />
                </div>
              )}
            </Popup>

            <Popup
              contentStyle={{ marginBottom: "5vh" }}
              trigger={
                <div className="deal-h">
                  <p>Post a Deal</p>
                </div>
              }
              modal
              closeOnDocumentClick={false}
              onOpen={() => setIsBlurred(true)}
              onClose={() => setIsBlurred(false)}
            >
              {(close) => <DealCreate close={close} />}
            </Popup>
          </div>
        </div>
      </div>

      <div className="creators">
        {isLoading ? (
          <div className="loading">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            <div className="creator-list">
              {deals && deals.length > 0 ? (
                deals.map((item, idx) => {
                  return <DealCard key={idx} prop={item} />;
                })
              ) : (
                <p
                  style={{
                    color: "white",
                    fontSize: "24px",
                    textAlign: "center",
                  }}
                >
                   No Deal Found
                </p>
              )}
            </div>
          </>
        )}
        <div className="pagination">
          <div className="buttons">
            <button
              disabled={currentPage === 1}
              onClick={handlePrevPage}
              className="pagination-button"
            >
              Previous
            </button>

            <button
              disabled={currentPage === totalPages}
              onClick={handleNextPage}
              className="pagination-button"
            >
              Next
            </button>
          </div>

          <div className="total">{`Page ${currentPage} of ${totalPages}`}</div>
        </div>
      </div>
    </div>
  );
}
export default Deals;
