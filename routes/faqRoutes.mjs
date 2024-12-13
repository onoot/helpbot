import express from 'express';
import FAQ from '../models/FAQ.mjs';
import WEL from '../models/WEL.mjs';

const router = express.Router();

// Получить все записи
router.get('/', async (req, res) => {
  try {
    const faqs = await FAQ.findAll();
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Добавить новую запись
router.post('/', async (req, res) => {
  try {
    const faq = await FAQ.create(req.body);
    res.json(faq);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Обновить запись
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await FAQ.update(req.body, { where: { id } });
    if (updated) {
      const updatedFAQ = await FAQ.findByPk(id);
      res.json(updatedFAQ);
    } else {
      res.status(404).send('FAQ not found');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Удалить запись
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FAQ.destroy({ where: { id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).send('FAQ not found');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Изменить запись

// Получить все записи
router.get('/', async (req, res) => {
  try {
    const wel = await WEL.findAll();
    res.json(wel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Добавить новую запись
router.post('/', async (req, res) => {
  try {
    const wel = await WEL.create(req.body);
    res.json(wel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Обновить запись
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await WEL.update(req.body, { where: { id } });
    if (updated) {
      const updatedWEL = await WEL.findByPk(id);
      res.json(updatedWEL);
    } else {
      res.status(404).send('WEL not found');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;
