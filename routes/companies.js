const express = require("express");
const slugify = require("slugify");
const ExpressError = require("../expressError");
const db = require("../db");

let router = new express.Router();

// GET / => List all companies
router.get("/", async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT code, name FROM companies ORDER BY name`
    );
    return res.json({ "companies": result.rows });
  } catch (err) {
    return next(err);
  }
});

// GET /[code] => Company details with invoices and industries
router.get("/:code", async (req, res, next) => {
  try {
    let code = req.params.code;

    const compResult = await db.query(
      `SELECT code, name, description 
       FROM companies 
       WHERE code = $1`,
      [code]
    );

    const invResult = await db.query(
      `SELECT id 
       FROM invoices 
       WHERE comp_code = $1`,
      [code]
    );

    const industryResult = await db.query(
      `SELECT i.industry 
       FROM industries i 
       JOIN company_industries ci 
       ON i.code = ci.industry_code 
       WHERE ci.company_code = $1`,
      [code]
    );

    if (compResult.rows.length === 0) {
      throw new ExpressError(`No such company: ${code}`, 404);
    }

    const company = compResult.rows[0];
    company.invoices = invResult.rows.map(inv => inv.id);
    company.industries = industryResult.rows.map(ind => ind.industry);

    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});


// POST / => Add a new company
router.post("/", async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const code = slugify(name, { lower: true });
    const result = await db.query(
      `INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description`,
      [code, name, description]
    );
    return res.status(201).json({ "company": result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

// PUT /[code] => Update company details
router.put("/:code", async (req, res, next) => {
  try {
    let { name, description } = req.body;
    let code = req.params.code;

    const result = await db.query(
      `UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description`,
      [name, description, code]
    );


    if (result.rows.length === 0) {
      throw new ExpressError(`No such company: ${code}`, 404);
    }


    return res.json({ "company": result.rows[0] });

  } catch (err) {
    return next(err);
  }
});

// DELETE /[code] => Delete company
router.delete("/:code", async (req, res, next) => {
  try {
    let code = req.params.code;


    const result = await db.query(
      `DELETE FROM companies WHERE code=$1 RETURNING code`,
      [code]
    );

    if (result.rows.length === 0) {
      throw new ExpressError(`No such company: ${code}`, 404);
    }

    return res.json({ "status": "deleted" });
    
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
