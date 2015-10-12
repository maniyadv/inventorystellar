# inventorystellar

A project that helps in analyzing the Hotel Inventory Systems in realtime. 


**Currently Supports**

 1. Hotels Availability check
 2. Search Hotels with check-in, check-out dates
 3. Book available hotel rooms between check-in, check-out dates
 4. Load hotel config and base allocation of inventory via php code
 5. Realtime rooms availabilty updation
 6. Realtime availability check while booking the room
 7. Failure handling in case of rooms don't get booked
 8. A booking bot that keeps booking the rooms to simulate real environment
 9. Bot intensity - slow/medium/fast to simulate booking intensity
 10. Real-time booking availability update between multiple users(browsers/systems)

**Installation** 

Simply clone the project and put it in your web directory. 
Change the HOST_URL in config/config.php to correct ip address of your system or domain you are putting it in.

    if (!defined('HOST_NAME'))  {
    	define('HOST_NAME', '127.0.1.1');
    }

Open index.php in browser. This will automatically run and load backend server. 
