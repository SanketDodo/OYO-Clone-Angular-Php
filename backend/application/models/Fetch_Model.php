<?php

class Fetch_Model extends CI_Model
{

    function __construct()
    {
        parent::__construct();
    }

    function get_data_by_query($query_string)
    {
        return $this->db->query($query_string)->result_array();
    }

    function searchInArray($array, $search_list)
    {

        // Create the result array
        $result = array();

        // Iterate over each array element
        foreach ($array as $key => $value) {

            // Iterate over each search condition
            foreach ($search_list as $k => $v) {
                // If the array element does not meet
                // the search condition then continue
                // to the next element
                if (!isset($value[$k]) || $value[$k] != $v) {
                    // Skip two loops
                    continue 2;
                }
            }
            $result[] = $value;
        }
        // Return result
        return $result;
    }

    public function app_login($data)
    {
        $user_data = $this->db->where(array('email' => $data['UserName'], 'password' => $data['Password']))->get("login")->row_array();

        if ($user_data) {
            $data['status'] = 'success';
            $data['LoginData'] = $user_data;
            return $data;
        } else {
            $data['status'] = 'error';
            $data['message'] = 'Either User Name or Password is Incorrect';
            return $data;
        }
    }

    public function get_login_by_id($id)
    {
        $this->db->where('id', $id);
        return $this->db->get('login')->row_array();
    }

    public function get_hotel_by_id($id)
    {
        $this->db->where('id', $id);
        return $this->db->get('hotel')->row_array();
    }

    public function get_hotel_images_by_hotel_id($id)
    {
        $this->db->where('fhotel_id', $id);
        return $this->db->get('hotel_images')->row_array();
    }

    public function get_booking_by_id($id)
    {
        $this->db->where('booking_id', $id);
        return $this->db->get('booking')->row_array();
    }

    public function get_booking_by_flogin_id($id)
    {
        $this->db->where('flogin_id', $id);
        return $this->db->get('booking')->result_array();
    }
    public function get_booking_by_hotelId($id)
    {
        $this->db->where('fhotel_id', $id);
        return $this->db->get('booking')->row_array();
    }
}
