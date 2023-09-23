<?php

class Update_Model extends CI_Model
{
    function __construct()
    {
        parent::__construct();
    }

    public function update_login_by_params($id, $params)
    {
        $this->db->where('id', $id);
        $this->db->update('login', $params);
        return $this->db->affected_rows();
    }
    public function update_booking_by_params($id, $params)
    {
        $this->db->where('id', $id);
        $this->db->update('booking', $params);
        return $this->db->affected_rows();
    }
    public function update_rooms_availablity_by_id($id, $params)
    {
        $this->db->where('id', $id);
        $this->db->update('rooms', $params);
        return $this->db->affected_rows();
    }
}
