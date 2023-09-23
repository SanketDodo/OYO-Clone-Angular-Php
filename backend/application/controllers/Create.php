<?php

/*
 * Generated by CRUDigniter v3.2
 * www.crudigniter.com
 */

class Create extends CI_Controller
{

    function __construct()
    {
        parent::__construct();

        //header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: accept, Origin, Content-Type, X-Auth-Token , Authorization');

        error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
        date_default_timezone_set('Asia/Calcutta');
        //require(APPPATH . 'libraries///logger.php');
        $this->load->library(array('session'));
    }

    function json_data()
    {
        header('Content-type: application/json');
        $json_request_data = file_get_contents("php://input");
        //logger::d("json_request_data",$json_request_data);
        $request_data = json_decode($json_request_data, true);
        //logger::d("request_data",$request_data);
        return $request_data;
    }


    public function create_hotel_details()
    {
        $json_data = $this->json_data();
        $this->db->trans_start();

        $FUserId = $json_data['FUserId'];
        $FUserTypeId = $json_data['FUserTypeId'];
        $data['hotel_name'] = $json_data['HotelName'];
        $data['description'] = $json_data['Description'];
        $data['owner_name'] = $json_data['OwnerName'];
        $data['mobile'] = $json_data['Mobile'];
        $data['email'] = $json_data['Email'];
        $data['address'] = $json_data['Address'];
        $data['city'] = $json_data['City'];
        $data['district'] = $json_data['District'];
        $data['state'] = $json_data['State'];
        $data['pin'] = $json_data['Pincode'];
        $data['created_by'] = $FUserId;
        $data['pin'] = $json_data['Pincode'];
        $data['IsDeleted'] = 0;
        $data['createdAt'] = date("Y-m-d H:i:s");

        $HotelImageData = $json_data['HotelImageData'];

        $inserted_hotel_id = $this->Create_Model->create_hotel_by_params($data);

        if ($inserted_hotel_id) {

            $LoginData['Fhotel_id'] = $inserted_hotel_id;
            $LoginData['user_type'] = HOTEL_OWNER;
            $LoginData['fullname'] = $json_data['OwnerName'];
            $LoginData['email'] = $json_data['Email'];
            $LoginData['mobile'] = $json_data['Mobile'];
            $LoginData['password'] = $json_data['Mobile'];
            $LoginData['created_by'] = $FUserId;
            $LoginData['verified'] = 1;
            $LoginData['createdAt'] = date("Y-m-d H:i:s");

            $this->Create_Model->create_login_by_params($LoginData);

            $HotelData['Fhotel_id'] = $inserted_hotel_id;

            if (!empty($HotelImageData)) {
                $target_path = APPPATH . "Uploads/HotelPhoto/"; //Declaring Path for uploaded images

                if (!file_exists($target_path)) {
                    mkdir($target_path, 0777, true);
                }

                for ($i = 0; $i < count($HotelImageData); $i++) {
                    $validextensions = array("jpeg", "jpg", "png", "JPG", "pdf", "PDF"); //Extensions which are allowed
                    $file_extension = $HotelImageData[$i]['Extension']; //store extensions in the variable
                    $file_name = $FUserId . '_' . md5(uniqid()) . '.' . $file_extension;

                    $new_target_path = $target_path . $file_name;
                    if (in_array($file_extension, $validextensions)) {

                        $img = (string)$HotelImageData[$i]['URI'];
                        $img = str_replace('data:image/jpeg;base64,', '', $img);
                        $img = str_replace(' ', '+', $img);
                        $img_data = base64_decode($img);
                        $file = $new_target_path;

                        if ($success = file_put_contents($file, $img_data)) { //if file moved to uploads folder
                            $HotelData['image_type'] = $HotelImageData[$i]['Type'];
                            $HotelData['image'] = $file_name;
                            $HotelData['createsAt'] = date("Y-m-d H:i:s");

                            $this->db->insert('hotel_images', $HotelData);
                        }
                    }
                }
            }

            $response["response"] = "success";
            $response["success_message"] = "Task Added Successfully";
        } else {
            $response["response"] = "error";
            $response["error_description"] = "Database Operation Failed";
        }

        $this->db->trans_complete();
        if ($this->db->trans_status() === FALSE) {
            $response["response"] = "error";
            $response["error_description"] = "Database Operation Failed.";
        }
        echo json_encode($response);
    }

    public function create_room()
    {
        $json_data = $this->json_data();
        $this->db->trans_start();

        $NoOfRooms = $json_data['NoOfRooms'];
        $FUserId = $json_data['FUserId'];
        $FUserTypeId = $json_data['FUserTypeId'];

        for ($n = 0; $n < intval($NoOfRooms); $n++) {

            $data['fhotel_id'] = $json_data['Fhotel_id'];
            $data['fmaster_room_type_id'] = $json_data['roomType'];
            $data['availablity'] = 1;
            $data['createdAt'] = date("Y-m-d H:i:s");
            $data['fmaster_package_type_id'] = '';
            for ($j = 0; $j < count($json_data['packageType']); $j++) {

                if ($j == 0) {
                    $data['fmaster_package_type_id'] .= $json_data['packageType'][$j];
                } else {
                    $data['fmaster_package_type_id'] .= "," . $json_data['packageType'][$j];
                }
            }
            $inserted_room_id = $this->Create_Model->create_room_by_params($data);

            if ($inserted_room_id) {

                $RoomFacilitiesData['fhotel_id'] = $json_data['Fhotel_id'];
                $RoomFacilitiesData['fmaster_room_type_id'] = $inserted_room_id;
                $RoomFacilitiesData['createdAt'] = date("Y-m-d H:i:s");

                for ($i = 0; $i < count($json_data['facilities']); $i++) {
                    $RoomFacilitiesData['frooms_facilities_id'] = $json_data['facilities'][$i];
                    $this->db->insert("rooms_facilities_master", $RoomFacilitiesData);
                }

                $response["response"] = "success";
                $response["success_message"] = "Room Added Successfully";
            } else {
                $response["response"] = "not success";
                $response["error_message"] = "Rooms added unsuccessful!";
            }
        }

        $this->db->trans_complete();
        if ($this->db->trans_status() === FALSE) {
            $response["response"] = "error";
            $response["error_description"] = "Database Operation Failed.";
        }

        echo json_encode($response);
    }

    public function create_room_type()
    {
        $json_data = $this->json_data();

        $data['fhotel_id'] = intval($json_data['Fhotel_id']);
        $data['room_type'] = $json_data['roomType'];
        $data['createdAt'] = date("Y-m-d H:i:s");

        $MasterRoomType = $this->Create_Model->create_master_room_type_by_params($data);

        if ($MasterRoomType) {
            $response["response"] = "success";
            $response["success_message"] = "Room Type Added Successfully";
        } else {
            $response["response"] = "error";
            $response["error_description"] = "Database Operation Failed.";
        }
        echo json_encode($response);
    }

    public function create_room_package()
    {
        $json_data = $this->json_data();

        $data['fhotel_id'] = intval($json_data['Fhotel_id']);
        $data['package_type'] = $json_data['roomPackage'];
        $data['fmaster_room_type_id'] = intval($json_data['PackageRoomType']);
        $data['rate'] = $json_data['rate'];
        $data['extra_bed_rate'] = $json_data['extrabedrate'];
        $data['discount'] = $json_data['discount'];
        $data['createdAt'] = date("Y-m-d H:i:s");

        if ($this->db->insert('master_package_type', $data)) {
            $response["response"] = "success";
            $response["success_message"] = "Room Package Added Successfully";
        } else {
            $response["response"] = "error";
            $response["error_description"] = "Database Operation Failed.";
        }

        echo json_encode($response);
    }

    public function generate_otp()
    {

        try {

            $otp = rand(1000, 9999);
            $encrypted_otp = hash('sha256', (string) $otp);

            $param['mobile'] = $_POST['Mobile'];
            $param['IsDeleted'] = 1;
            $param['user_type'] = 4; //for guewst user only
            $check_user = $this->db->get_where('login', $param)->row_array();

            if ($check_user) {

                $update_data['otp'] = $encrypted_otp;
                $this->Update_Model->update_login_by_params($check_user['id'], $update_data);

                $data1['fullname'] = $check_user['fullname'];
                $data1['email'] = $check_user['email'];
                $data1['otp'] = $otp;

                $response["response_code"] = 1;
                $response["msg"] = "OTP Sent!";
                $response["data"] = $data1;
            } else {

                $data['mobile'] = $_POST['Mobile'];
                $data['user_type'] = 4;
                $data['otp'] = $encrypted_otp; //! added temporerry
                $data['createdAt'] = date("Y-m-d H:i:s");

                $insert_id = $this->Create_Model->create_login_by_params($data);

                if ($insert_id) {
                    $response["response_code"] = 1;
                    $response["msg"] = "OTP Sent!";
                    $response["otp"] = $otp;
                } else {
                    $response["response_code"] = 0;
                    $response["msg"] = "Database Operation Failed.";
                }
            }
        } catch (\Exception $err) {
            //throw $err;
            $response["response_code"] = 0;
            $response["msg"] = $err;
        }
        echo json_encode($response);
    }
    public function verifyotp()
    {
        try {

            $client_otp = $_POST['otp'];
            $param['mobile'] = $_POST['Mobile'];
            $param['IsDeleted'] = 1;
            $param['user_type'] = 4; //for guewst user only

            $otp_from_client = hash('sha256', (string) $client_otp);
            $check_user = $this->db->get_where('login', $param)->row_array();

            if ($check_user['otp'] == $otp_from_client) {

                $update_data['mobile'] = $_POST['Mobile'];
                $update_data['fullname'] = $_POST['username'];
                $update_data['email'] = $_POST['email'];
                $update_data['verified'] = 1;
                $update_data['updatedAt'] = date("Y-m-d H:i:s");

                $this->Update_Model->update_login_by_params($check_user['id'], $update_data);
                $getUpdatedData = $this->Fetch_Model->get_login_by_id($check_user['id']);
                if ($getUpdatedData) {
                    $data['id'] = $getUpdatedData['id'];
                    $data['username'] = $getUpdatedData['fullname'];
                    $data['email'] = $getUpdatedData['email'];
                    $data['mobile'] = $getUpdatedData['mobile'];

                    if ($data) {
                        $response["response_code"] = 1;
                        $response["msg"] = "verified!";
                        $response["data"] = $data;
                    }
                }
            } else {
                $response["response_code"] = 0;
                $response["msg"] = "not verified!";
            }

            echo json_encode($response);
        } catch (\Exception $err) {
            //throw $th;
            $response["response_code"] = 0;
            $response["msg"] = $err;
        }
    }

    public function modifyUserDetails()
    {
        try {

            $param['mobile'] = $_POST['Mobile'];
            $param['IsDeleted'] = 1;
            $param['user_type'] = 4; //for guewst user only

            $check_user = $this->db->get_where('login', $param)->row_array();

            if ($check_user) {

                $update_data['fullname'] = $_POST['username'];
                $update_data['email'] = $_POST['email'];
                $update_data['verified'] = 1;
                $update_data['updatedAt'] = date("Y-m-d H:i:s");

                $this->Update_Model->update_login_by_params($check_user['id'], $update_data);
                $getUpdatedData = $this->Fetch_Model->get_login_by_id($check_user['id']);

                if ($getUpdatedData) {
                    $data['id'] = $getUpdatedData['id'];
                    $data['username'] = $getUpdatedData['fullname'];
                    $data['email'] = $getUpdatedData['email'];
                    $data['mobile'] = $getUpdatedData['mobile'];

                    if ($data) {
                        $response["response_code"] = 1;
                        $response["msg"] = "User Details Updated!";
                        $response["data"] = $data;
                    }
                }
            } else {
                $response["response_code"] = 0;
                $response["msg"] = "not Updated!";
            }

            echo json_encode($response);
        } catch (\Exception $err) {
            //throw $th;
            $response["response_code"] = 0;
            $response["msg"] = $err;
        }
    }

    public function bookingHotel()
    {
        try {

            if (isset($_POST['userId']) && isset($_POST['hotelId']) && isset($_POST['totalRooms']) && isset($_POST['roomTypeId'])) {

                $room_available_data = $this->db->query("SELECT * FROM rooms WHERE fhotel_id= " . $_POST['hotelId'] . " AND fmaster_room_type_id=" . $_POST['roomTypeId'] . " AND FIND_IN_SET(" . $_POST['packageTypeId'] . ", fmaster_package_type_id) AND availablity = 1 AND IsDeleted = 1 ")->result_array();

                if (count($room_available_data) >= $_POST['totalRooms']) {

                    $chOut =  date("Y-m-d", strtotime($_POST['check_out']));
                    $tomorrow = date("Y-m-d", strtotime("+1 day"));

                    if ($chOut == $tomorrow) {
                        $param['check_out'] = date("Y-m-d H:i:s", strtotime($_POST['check_in']));
                    } else {
                        $param['check_out'] = date("Y-m-d H:i:s", strtotime($_POST['check_out']));
                    }

                    // $param['frooms_id'] = $implode_ids;
                    $param['flogin_id'] = $_POST['userId'];
                    $param['fhotel_id'] = $_POST['hotelId'];
                    $param['room_type'] = $_POST['roomType'];
                    $param['package_type'] = $_POST['packageType'];
                    $param['no_of_rooms'] = $_POST['totalRooms'];
                    $param['no_of_guests'] = $_POST['totalGuests'];
                    $param['check_in'] = date("Y-m-d H:i:s", strtotime($_POST['check_in']));

                    $param['username'] = $_POST['username'];
                    $param['email'] = $_POST['email'];
                    $param['mobile'] = $_POST['mobile'];
                    $param['rate'] = $_POST['rate'];
                    $param['discount_percent'] = $_POST['discount_percent'];
                    $param['discounted_price'] = $_POST['discounted_price'];
                    $param['final_bill'] = $_POST['final_bill'];
                    $param['createdAt'] = date("Y-m-d H:i:s");

                    $booking_id = $this->Create_Model->create_booking_by_params($param);

                    if ($booking_id) {

                        for ($i = 0; $i < $_POST['totalRooms']; $i++) {
                            # code...
                            $implodes[] = $room_available_data[$i]['id'];

                            $totdaysDate = date("Y-m-d");
                            $checkDate =  date("Y-m-d", strtotime($_POST['check_in']));

                            if ($totdaysDate == $checkDate) {
                                $update_availablity['availablity'] = 0; // make un-available room
                            } else {
                                $update_availablity['availablity'] = 1; // make available room
                            }

                            $this->Update_Model->update_rooms_availablity_by_id($room_available_data[$i]['id'], $update_availablity);
                        }




                        $implode_ids = implode(',', $implodes);

                        $update_data['frooms_id'] = $implode_ids;
                        $update_data['booking_id'] = $_POST['totalRooms'] . $_POST['totalGuests'] . strtoupper($_POST['username'][0]) . strtoupper($_POST['username'][1]) . $booking_id;

                        if ($this->Update_Model->update_booking_by_params($booking_id, $update_data)) {
                            $response["response_code"] = 1;
                            $response["msg"] = "Your stay is confirmed!";
                            $response["data"] = $update_data;
                        } else {
                            $response["response_code"] = 0;
                            $response["msg"] = "Database Operation Failed.";
                        }
                    } else {
                        $response["response_code"] = 0;
                        $response["msg"] = "Database Operation Failed.";
                    }
                } else {
                    $response["response_code"] = 0;
                    $response["msg"] = "Sorry! Room unavailable, Try again later.";
                }
            } else {
                $response["response_code"] = 0;
                $response["msg"] = "Sorry! Something went wrong!";
            }
        } catch (\Exception $err) {
            //throw $err;
            $response["response_code"] = 0;
            $response["msg"] = $err;
        }

        echo json_encode($response);
    }
}