import React, { useCallback, useEffect, useState } from "react";
import "./Promotions.css";
import { FiSearch } from "react-icons/fi";
import dotenv from "dotenv";
import { fetchSearchAndFilterData, fetchUserData } from "../../api/data";
import { debounce } from "lodash";

dotenv.config();

const CreatorCard = React.lazy(() =>
  import("../../components/CreatorCard/CreatorCard")
);
const Popup = React.lazy(() => import("reactjs-popup"));
const Filter = React.lazy(() => import("../../components/Filter/Filter"));
const DealCreate = React.lazy(() =>
  import("../../components/DealCreate/DealCreate")
);

dotenv.config();

const Promotions = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsloading] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);
  const [filter, setFilter] = useState(null);
  // Debounce the fetch function to prevent excessive API calls
  const debouncedFetchData = useCallback(
    debounce(async (searchTerm, page, filterdata) => {
      setIsloading(true);

      try {
        const response = await fetchSearchAndFilterData({
          searchTerm,
          page,
          filterdata,
        });

        if (response && response.data) {
          setData(response.data);
          setTotalPages(response.totalPages || 1);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsloading(false);
      }
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    debouncedFetchData(value, 1, filter);
    setCurrentPage(1);
  };

  const loadUserData = async (page = 1) => {
    setIsloading(true);
    try {
      const result = await fetchUserData(page);
      if (result) {
        setData(result.data);
        setTotalPages(result.totalPages);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    setIsloading(true);
    loadUserData(currentPage);
  }, []);

  // Handle filter data
  const fetchDataWithFilter = (filteredData) => {
    setFilter(filteredData);
    debouncedFetchData(search, 1, filteredData);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      search === ""
        ? loadUserData(currentPage + 1)
        : debouncedFetchData(search, currentPage + 1, filter);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);

    search === ""
      ? loadUserData(currentPage - 1)
      : debouncedFetchData(search, currentPage - 1, filter);
  };

  return (
    <div
      className={`promotions-container ${isBlurred ? "blur-background" : ""}`}
    >
      <div className="header">
        <div className="h-deal">
          <h2>Creators</h2>
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
                  placeholder="Search Creators"
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
                loadUserData(1);
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
              modal
              onOpen={() => setIsBlurred(true)}
              onClose={() => setIsBlurred(false)}
            >
              {(close) => (
                <Filter
                  helper={fetchDataWithFilter}
                  loading={setIsloading}
                  close={close}
                />
              )}
            </Popup>
            <Popup
              contentStyle={{ marginBottom: "5vh" }}
              trigger={
                <div className="deal-h">
                  <p>Post Deal</p>
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
              {data && data.length > 0 ? (
                data.map((item, idx) => {
                  if (item.approved === "true") {
                    const creatorObj = {
                      name: item.userName,
                      email: item.email,
                      image: item.image,
                      linkedinurl: item.socialMedia.linkedin.url,
                      linkedincount: item.socialMedia.linkedin.count,
                      instaurl: item.socialMedia.insta.url,
                      instacount: item.socialMedia.insta.count,
                      twitterurl: item.socialMedia.twitter.url,
                      twittercount: item.socialMedia.twitter.count,
                      facebookurl: item.socialMedia.facebook.url,
                      facebookcount: item.socialMedia.facebook?.count,
                      youtubeurl: item.socialMedia.youtube.url,
                      youtubecount: item.socialMedia.youtube.count,
                    };
                    return (
                      <CreatorCard
                        key={`${item.id}.${idx}`}
                        props={creatorObj}
                      />
                    );
                  } else {
                    return null;
                  }
                })
              ) : (
                <p
                  style={{
                    color: "white",
                    fontSize: "24px",
                    textAlign: "center",
                  }}
                >
                  No Creator Found
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
};

export default Promotions;
