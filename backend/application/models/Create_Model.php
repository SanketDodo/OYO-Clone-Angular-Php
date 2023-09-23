<?php

class Create_Model extends CI_Model
{

    function __construct()
    {
        parent::__construct();
    }

    //! only Add module should be here

    public function create_login_by_params($params)
    {
        $this->db->insert('login', $params);
        return $this->db->insert_id();
    }

    public function create_hotel_by_params($params)
    {
        $this->db->insert('hotel', $params);
        return $this->db->insert_id();
    }

    public function create_room_by_params($params)
    {
        $this->db->insert('rooms', $params);
        return $this->db->insert_id();
    }

    public function create_master_room_type_by_params($params)
    {
        $this->db->insert('master_room_type', $params);
        return $this->db->insert_id();
    }

    public function create_master_room_package_by_params($params)
    {
        $this->db->insert('master_room_package', $params);
        return $this->db->insert_id();
    }

    public function create_master_room_facility_by_params($params)
    {
        $this->db->insert('master_room_facility', $params);
        return $this->db->insert_id();
    }

    public function create_booking_by_params($params)
    {
        $this->db->insert('booking', $params);
        return $this->db->insert_id();
    }


    

}


