"use client";

import { useMemo, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type LoanReasonOption =
  | 'House Construction'
  | 'Medical Treatment'
  | "Children's Education"
  | "Daughter's marriage expenses"
  | 'Other';

function formatIndianCurrency(amount: string | number): string {
  const num = typeof amount === 'string' ? Number(amount || 0) : amount;
  if (Number.isNaN(num)) return '';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
}

export default function HomePage() {
  const [employeeName, setEmployeeName] = useState<string>('');
  const [ebNumber, setEbNumber] = useState<string>('');
  const [departmentDesignation, setDepartmentDesignation] = useState<string>('');
  const [loanAmount, setLoanAmount] = useState<string>('');
  const [loanReason, setLoanReason] = useState<LoanReasonOption>('House Construction');
  const [loanReasonOther, setLoanReasonOther] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');

  const letterRef = useRef<HTMLDivElement | null>(null);

  const resolvedReason = useMemo(() => {
    return loanReason === 'Other' && loanReasonOther.trim() !== ''
      ? loanReasonOther.trim()
      : loanReason;
  }, [loanReason, loanReasonOther]);

  const todayString = useMemo(() => {
    const d = new Date();
    const formatter = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    return formatter.format(d);
  }, []);

  async function handleDownloadPdf() {
    const element = letterRef.current;
    if (!element) return;

    // Ensure consistent width for A4 aspect capture
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    const safeName = employeeName.trim().replace(/\s+/g, '_') || 'Letter';
    pdf.save(`PF_Loan_Application_${safeName}.pdf`);
  }

  return (
    <main className="main">
      <section className="formCard">
        <div className="sectionTitle">Employee & Loan Details</div>
        <div className="grid2">
          <label className="field">
            <span>Employee Name</span>
            <input
              type="text"
              placeholder="Enter employee full name"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
            />
          </label>
          <label className="field">
            <span>EB Number</span>
            <input
              type="text"
              placeholder="Enter EB number"
              value={ebNumber}
              onChange={(e) => setEbNumber(e.target.value)}
            />
          </label>
          <label className="field gridSpan2">
            <span>Department & Designation</span>
            <input
              type="text"
              placeholder="e.g., Maintenance ? Senior Technician"
              value={departmentDesignation}
              onChange={(e) => setDepartmentDesignation(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Loan Amount (?)</span>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              placeholder="e.g., 100000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Loan Reason</span>
            <select value={loanReason} onChange={(e) => setLoanReason(e.target.value as LoanReasonOption)}>
              <option>House Construction</option>
              <option>Medical Treatment</option>
              <option>Children's Education</option>
              <option>Daughter's marriage expenses</option>
              <option>Other</option>
            </select>
          </label>
          {loanReason === 'Other' && (
            <label className="field gridSpan2">
              <span>Specify Other Reason</span>
              <input
                type="text"
                placeholder="Enter loan reason"
                value={loanReasonOther}
                onChange={(e) => setLoanReasonOther(e.target.value)}
              />
            </label>
          )}
          <label className="field gridSpan2">
            <span>Mobile Number</span>
            <input
              type="tel"
              inputMode="tel"
              placeholder="e.g., 9876543210"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
          </label>
        </div>
        <div className="actions">
          <button className="primary" onClick={handleDownloadPdf}>Download PDF</button>
        </div>
      </section>

      <section className="previewCard">
        <div className="sectionTitle">Letter Preview</div>
        <div className="a4Wrapper">
          <div className="letter" ref={letterRef}>
            <div className="letterHeader">
              <div>Date: {todayString}</div>
            </div>
            <div className="letterBody">
              <p>To,<br/>
              <strong>The Labour Officer</strong><br/>
              Anglo India Jute &amp; Textile Industries Pvt. Ltd.<br/>
              West Ghoshpara Road, Jagaddal, North 24 Parganas</p>

              <p><strong>Subject:</strong> Request for Non-Refundable Loan Withdrawal against PF</p>

              <p>Respected Sir/Madam,</p>

              <p>
                I, <strong>{employeeName || '__________'}</strong> (EB No. <strong>{ebNumber || '__________'}</strong>),
                working as <strong>{departmentDesignation || '__________'}</strong>, kindly request a
                non-refundable withdrawal from my Provident Fund for <strong>{resolvedReason || '__________'}</strong>.
              </p>

              <p>
                The amount requested is <strong>{loanAmount ? formatIndianCurrency(loanAmount) : '? _________'}</strong>.
              </p>

              <p>
                I confirm that the information provided is true and accurate to the best of my knowledge. I request you to kindly
                process the withdrawal at the earliest.
              </p>

              <p>For any clarification, I can be reached at <strong>{mobileNumber || '__________'}</strong>.</p>

              <p>Thank you.</p>

              <p>Sincerely,<br/>
              <strong>{employeeName || '__________'}</strong><br/>
              EB No. {ebNumber || '__________'}<br/>
              Date: {todayString}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
