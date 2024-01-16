// import { restaurantList } from "../contants";
// import RestaurantCard from "./RestaurantCard";
// import { useState } from "react";
// // What is state
// // what is React Hooks? - functions,
// // What is useState
// function filterData(searchText, restaurants) {
//   const filterData = restaurants.filter((restaurant) =>
//     restaurant.data.name.includes(searchText)
//   );
//   return filterData;
// }
// const Body = () => {
//   const [restaurants, setRestaurants] = useState(restaurantList);
//   const [searchText, setSearchText] = useState("");
//   return (
//     <>
//       <div className="search-container">
//         <input
//           type="text"
//           className="search-input"
//           placeholder="Search"
//           value={searchText}
//           onChange={(e) => {
//             setSearchText(e.target.value);
//           }}
//         />
//         <button
//           className="search-btn"
//           onClick={() => {
//             //need to filter the data
//             const data = filterData(searchText, restaurants);
//             // update the state - restaurants
//             setRestaurants(data);
//           }}
//         >
//           Search
//         </button>
//       </div>
//       <div className="restaurant-list">
//         {restaurants.map((restaurant) => {
//           return (
//             <RestaurantCard {...restaurant.data} key={restaurant.data.id} />
//           );
//         })}
//       </div>
//     </>
//   );
// };
// export default Body;

import React, { useState, useEffect } from "react";
import { restaurantList } from "../contants";
import RestaurantCard from "./RestaurantCard";
import Shimmer from "./Shimmer";

function filterData(searchText, restaurants) {
  const filteredData = restaurants.filter((restaurant) =>
    restaurant?.data?.name?.toLowerCase().includes(searchText.toLowerCase())
  );
  return filteredData;
}

const Body = () => {
  const [restaurants, setRestaurants] = useState(restaurantList);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    // Fetch restaurants on initial render
    getRestaurants();
  }, []);

  async function getRestaurants() {
    try {
      const data = await fetch(
        "https://www.swiggy.com/dapi/restaurants/list/v5?lat=28.6126255&lng=77.04108959999999&page_type=DESKTOP_WEB_LISTING"
      );
      const json = await data.json();
      
      const cards = json?.data?.card[2]?.card?.info || [];
      
      setAllRestaurants(cards);
      setFilteredRestaurants(cards);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  }

  const handleSearch = () => {
    const filteredData = filterData(searchText, allRestaurants);
    setRestaurants(filteredData);
    setFilteredRestaurants(filteredData);
  };

  // Render shimmer if no data is available
  if (!allRestaurants || allRestaurants.length === 0) {
    return <Shimmer />;
  }

  // Render message if no restaurants match the filter
  if (filteredRestaurants.length === 0) {
    return <h1>No Restaurants match your filter!</h1>;
  }

  return (
    <>
      <div className="search-container">
        <input
          type="text"
          className="searsch-input"
          placeholder="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>
      <div className="restaurant-list">
        {filteredRestaurants.map((restaurant) => (
          <RestaurantCard {...restaurant.data} key={restaurant.data.id} />
        ))}
      </div>
    </>
  );
};


export default Body;



