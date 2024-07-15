import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addJob } from '../features/jobs/jobsSlice';
import { fetchJobCategories, selectAllCategories } from '../features/jobCategories/jobCategoriesSlice';

const AddJobForm = () => {
  const dispatch = useDispatch();
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    responsibilities: '',
    qualifications: '',
    nice_to_have: '',
    employment_type: '',
    location: '',
    salary_min: '',
    salary_max: '',
    is_remote: false,
    application_deadline: '',
    experience_level: '',
    job_function: '',
    categories: [],
  });

  const categories = useSelector(selectAllCategories);
  const categoriesStatus = useSelector((state) => state.jobCategories.status);
  const categoriesError = useSelector((state) => state.jobCategories.error);

  useEffect(() => {
    if (categoriesStatus === 'idle') {
      dispatch(fetchJobCategories());
    }
  }, [categoriesStatus, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setJobData({
      ...jobData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleCategoryChange = (e) => {
    const { options } = e.target;
    const selectedCategories = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedCategories.push(parseInt(options[i].value, 10));
      }
    }
    setJobData({
      ...jobData,
      categories: selectedCategories,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addJob(jobData));
    setJobData({
      title: '',
      description: '',
      responsibilities: '',
      qualifications: '',
      nice_to_have: '',
      employment_type: '',
      location: '',
      salary_min: '',
      salary_max: '',
      is_remote: false,
      application_deadline: '',
      experience_level: '',
      job_function: '',
      categories: [],
    });
  };

  if (categoriesStatus === 'loading') {
    return <div>Loading...</div>;
  }

  if (categoriesStatus === 'failed') {
    return <div>Error: {categoriesError}</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Job Title"
        value={jobData.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Job Description"
        value={jobData.description}
        onChange={handleChange}
        required
      />
      <textarea
        name="responsibilities"
        placeholder="Responsibilities"
        value={jobData.responsibilities}
        onChange={handleChange}
      />
      <textarea
        name="qualifications"
        placeholder="Qualifications"
        value={jobData.qualifications}
        onChange={handleChange}
      />
      <textarea
        name="nice_to_have"
        placeholder="Nice to Have"
        value={jobData.nice_to_have}
        onChange={handleChange}
      />
      <input
        type="text"
        name="employment_type"
        placeholder="Employment Type"
        value={jobData.employment_type}
        onChange={handleChange}
      />
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={jobData.location}
        onChange={handleChange}
      />
      <input
        type="number"
        name="salary_min"
        placeholder="Salary Min"
        value={jobData.salary_min}
        onChange={handleChange}
      />
      <input
        type="number"
        name="salary_max"
        placeholder="Salary Max"
        value={jobData.salary_max}
        onChange={handleChange}
      />
      <label>
        Remote:
        <input
          type="checkbox"
          name="is_remote"
          checked={jobData.is_remote}
          onChange={handleChange}
        />
      </label>
      <input
        type="date"
        name="application_deadline"
        placeholder="Application Deadline"
        value={jobData.application_deadline}
        onChange={handleChange}
      />
      <input
        type="text"
        name="experience_level"
        placeholder="Experience Level"
        value={jobData.experience_level}
        onChange={handleChange}
      />
      <input
        type="text"
        name="job_function"
        placeholder="Job Function"
        value={jobData.job_function}
        onChange={handleChange}
      />
      <label>
        Categories:
        <select
          name="categories"
          multiple
          value={jobData.categories}
          onChange={handleCategoryChange}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">Add Job</button>
    </form>
  );
};

export default AddJobForm;
