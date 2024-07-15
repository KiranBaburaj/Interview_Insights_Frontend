import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJobs, selectAllJobs } from '../features/jobs/jobsSlice';

const JobList = () => {
  const dispatch = useDispatch();
  const jobs = useSelector(selectAllJobs);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  // Handle initial loading state or empty jobs array
  if (!Array.isArray(jobs)) {
    return (
      <div>
        <h2>Jobs List</h2>
        <p>Loading...</p>
      </div>
    );
  }

  // Ensure jobs is an array before mapping over it
  return (
    <div>
      <h2>Jobs List</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>{job.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default JobList;
