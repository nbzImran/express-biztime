// routes/industries.js
const express = require("express");
const slugify = require("slugify");
const db = require("../db");
const ExpressError = require("../expressError");

const router = new express.Router();

/** GET /industries => list all industries with company codes */
router.get("/", async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT i.code, i.industry, 
             ARRAY_AGG(ci.company_code) AS companies
      FROM industries i
      LEFT JOIN company_industries ci 
      ON i.code = ci.industry_code
      GROUP BY i.code, i.industry
      ORDER BY i.industry
    `);
    return res.json({ industries: result.rows });
  } catch (err) {
    return next(err);
  }
});

/** POST /industries => add a new industry */
router.post("/", async (req, res, next) => {
  try {
    const { industry } = req.body;
    const code = slugify(industry, { lower: true });

    const result = await db.query(
      `INSERT INTO industries (code, industry)
       VALUES ($1, $2)
       RETURNING code, industry`,
      [code, industry]
    );

    return res.status(201).json({ industry: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

/** POST /industries/:industryCode/companies/:companyCode => associate industry with company */
router.post("/:industryCode/companies/:companyCode", async (req, res, next) => {
  try {
    const { industryCode, companyCode } = req.params;

    const result = await db.query(
      `INSERT INTO company_industries (industry_code, company_code)
       VALUES ($1, $2)
       RETURNING industry_code, company_code`,
      [industryCode, companyCode]
    );

    return res.status(201).json({ association: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
