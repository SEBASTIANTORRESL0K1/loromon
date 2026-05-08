import { pool } from '../database/db.js';

export const getLocations = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM locations');
        res.json(rows);
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
};

export const getLocation = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM locations WHERE id = ?', [req.params.id]);
        if (rows.length <= 0) return res.status(404).json({
            message: 'Location not found'
        });
        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
};

export const createLocation = async (req, res) => {
    const { name, description, latitude, longitude, category } = req.body;
    try {
        const [rows] = await pool.query(
            'INSERT INTO locations (name, description, latitude, longitude, category) VALUES (?, ?, ?, ?, ?)',
            [name, description, latitude, longitude, category]
        );
        res.send({
            id: rows.insertId,
            name,
            description,
            latitude,
            longitude,
            category
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
};

export const updateLocation = async (req, res) => {
    const { id } = req.params;
    const { name, description, latitude, longitude, category } = req.body;
    
    try {
        const [result] = await pool.query(
            'UPDATE locations SET name = IFNULL(?, name), description = IFNULL(?, description), latitude = IFNULL(?, latitude), longitude = IFNULL(?, longitude), category = IFNULL(?, category) WHERE id = ?',
            [name, description, latitude, longitude, category, id]
        );

        if (result.affectedRows === 0) return res.status(404).json({
            message: 'Location not found'
        });

        const [rows] = await pool.query('SELECT * FROM locations WHERE id = ?', [id]);
        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
};

export const deleteLocation = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM locations WHERE id = ?', [req.params.id]);

        if (result.affectedRows <= 0) return res.status(404).json({
            message: 'Location not found'
        });

        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
};
