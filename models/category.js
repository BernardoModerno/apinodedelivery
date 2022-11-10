const db = require('../config/config');
const Category = {};

Category.getAll = (result) => {
    const sql = `
    SELECT
        id,
        name,
        description,
        image
    FROM
        categories
    ORDER BY
        name
    `;

    db.query(
        sql,
        (err, data) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Id da nova categoria:', data);
                result(null, data);
            }
        }
    )
}

Category.create = (category, result) => {
    const sql = `
    INSERT INTO
        categories(
            name,
            description,
            image,
            created_at,
            updated_at
        )
    VALUES(?, ?, ?, ?, ?)
    `;

    db.query(
        sql, 
        [
            category.name,
            category.description,
            category.image,
            new Date(),
            new Date()
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Id da nova categoria:', res.insertId);
                result(null, res.insertId);
            }
        }
    )
}

Category.delete = (id, result) => {
    const sql = `
    DELETE FROM
        categories
    WHERE
        id = ?
    `;
    db.query(
        sql,
        id,
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Id da categoria eliminada:', id);
                result(null, id);
            }
        }
    )
}

module.exports = Category;