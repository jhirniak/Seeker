% usecase.sty
%  Use case table and diagram
% 28 May 2014, Jaroslaw Hirniak, j@hirniak.info

% --- Class structure: identification part
% ---
\ProvidesClass{usecase}[2014/05/28 version 1.00 Use Case]
\NeedsTeXFormat{LaTeX2e}

% --- Class structure: initial code part
% ---

% Use Case ID
\def\@usecaseid{}
\newcommand{\setid}[1]{\def\@usecaseid{#1}}
\newcommand{\show@id}{\@usecaseid}

% Use Case Name
\def\@usecasename{}
\newcommand{\setname}[1]{\def\@usecasename{#1}}
\newcommand{\show@name}{\@usecasename}

% Created By
% NOTE: Left out for now as unnecessary

% Last Updated By
% NOTE: Left out for now as unnecessary

% Date Created
\def\@dateCreated{}
\newcommand{\setDatecCreated}[1]{\def\@dateCreated{#1}}
\newcommand{\show@dateCreated}{\@dateCreated}

% Date Last Updated
\def\@datelastupdated{}
\newcommand{\setDateLastUpdated}[1]{\def\@datelastupdated{#1}}
\newcommand{\show@dateLastUpdated}{\@datelastupdated}

% TODO: camelize up

% Actors
\def\@lstActors{}
\newcommand{\setActors}[1]{\def\@lstActors{#1}}
\newcommand{\show@actors}{\@lstActors}

% Description
\def\@description{}
\newcommand{\setDescription}[1]{\def\@description{#1}}
\newcommand{\show@description}{\@description}

% Use Case Relationship
% TODO: Implement using graph stored in one shared file

\newcommand{\ppath}[2][ $\triangleright$ ]{%
  \def\nextitem{\def\nextitem{#1}}%
  \@for \el:=#2\do{\nextitem\el}%
}

\newcommand{\blist}[2][ $\triangleright$ ]{%
  \vspace{-\baselineskip}
  \begin{itemize}
    \itemsep0em 
    \@for \el:=#2\do{\item\el}%
  \end{itemize}
   \vspace*{-\baselineskip}\leavevmode
}

\newcommand{\elist}[2][ $\triangleright$ ]{%
  \vspace{-\baselineskip}
  \begin{enumerate}
    \itemsep0em 
    \@for \el:=#2\do{\item\el}%
  \end{enumerate}
   \vspace*{-\baselineskip}\leavevmode
}

%\makeatother

% Preconditions
\def\@lstPreconditions{}
\newcommand{\setPreconditions}[1]{\def\@lstPreconditions{#1}}
\newcommand{\show@preconditions}{\blist{\@lstPreconditions}}

% Postconditions
\def\@lstPostconditions{}
\newcommand{\setPostconditions}[1]{\def\@lstPostconditions{#1}}
\newcommand{\show@postconditions}{\blist{\@lstPostconditions}}

% Priority
\def\@priority{}
\newcommand{\setPriority}[1]{\def\@priority{#1}}
\newcommand{\show@priority}{\@priority}

% Frequency of Use
\def\@frequency{}
\newcommand{\setFrequency}[1]{\def\@frequency{#1}}
\newcommand{\show@frequency}{\@frequency}

% Basic Flow
% Diagram, enumerated list, or both
\def\@lstBasicFlow{}
\newcommand{\setBasicFlow}[1]{\def\@lstBasicFlow{#1}}
\newcommand{\show@basicFlow}{\elist{\@lstBasicFlow}}

\def\@diagBasicFlow{}
\newcommand{\setBasicFlowDiag}[1]{\def\@diagBasicFlow{#1}}
\newcommand{\show@basicFlowDiag}{\@diagBasicFlow}

% Alternative Flow
% Diagram, enumerated list, or both
\def\@lstAlternativeFlow{}
\newcommand{\setAlternativeFlow}[1]{\def\@lstAlternativeFlow{#1}}
\newcommand{\show@alternativeFlow}{\elist{\@lstAlternativeFlow}}

\def\@diagAlternativeFlow{}
\newcommand{\setAlternativeFlowDiag}[1]{\def\@diagAlternativeFlow{#1}}
\newcommand{\show@alternativeFlowDiag}{\@diagAlternativeFlow}

% Exceptions
\def\@lstExceptions{}
\newcommand{\setExceptions}[1]{\def\@lstExceptions{#1}}
\newcommand{\show@exceptions}{\@lstExceptions}

% Includes
% NOTE: Left out for now as unnecessary

% Special Requirements
\def\@lstSpecialRequirements{}
\newcommand{\setSpecialRequirements}[1]{\def\@lstSpecialRequirements{#1}}
\newcommand{\show@specialRequirements}{\@lstSpecialRequirements}

% Assumptions
\def\@lstAssumptions{}
\newcommand{\setAssumptions}[1]{\def\@lstAssumptions{#1}}
\newcommand{\show@assumptions}{\@lstAssumptions}

% Notes and Issues
\def\@notes{}
\newcommand{\setNotes}[1]{\def\@notes{#1}}
\newcommand{\show@notes}{\@notes}

% Date of Processing
\def\@date{\today}
\newcommand{\setdate}[1]{\def\@date{#1}}
\newcommand{\show@date}{\@date}

% --- Class structure: declaration of options part
% ---
% This class extends the article class
% Read all the documentclass options; pass them to article, unless the file
% named "<currentoption>.min" exists, in which case it is loaded
%\DeclareOption*{\InputIfFileExists{\CurrentOption.min}{}{%
%    \PassOptionsToClass{\CurrentOption}{article}}
%\DeclareOption*{\PassOptionsToClass{\CurrentOption}{article}}

\DeclareOption*{\InputIfFileExists{\CurrentOption.min}{}{%
    \PassOptionsToClass{\CurrentOption}{article}}}

% --- Class structure: execution of options part
% ---
\ProcessOptions \relax

% --- Class structure: declaration of options part
% ---
\LoadClass{article}

% --- Class structure: main code part
% ---

% material heading the minutes
\newcommand{\head@list}{
\begin{description}
\item[Members:] \show@members
\ifx\@absent\@empty
  \relax
\else
  \item[Absent:] \show@absent
\fi %
\ifx\@alsopresent\@empty
  \relax
\else
  \item[Also present:] \show@alsopresent
\fi %
\end{description}
}

% Page layout
\RequirePackage[left=2cm, right=2cm, top=2cm, bottom=2cm]{geometry}

\RequirePackage{array}

\def\arraystretch{1.5}

\newcolumntype{L}[1]{>{\raggedright\let\newline\\\arraybackslash\hspace{0pt}}m{#1}}
\newcolumntype{C}[1]{>{\centering\let\newline\\\arraybackslash\hspace{0pt}}m{#1}}
\newcolumntype{R}[1]{>{\raggedleft\let\newline\\\arraybackslash\hspace{0pt}}m{#1}}

\RequirePackage{etoolbox} % http://ctan.org/pkg/etoolbox

% -

\ProcessOptions\relax

\newenvironment{usecase}{%

\begin{tabular}{!{\vrule width 2pt}R{4cm}|L{11cm}!{\vrule width 2pt}}
\noalign{\hrule height 2pt}
Use Case ID: & \show@id \\\hline
Use Case Name: & \show@name \\\hline
Date Created: & \show@dateCreated \\\hline
Date Last Updated: & \show@dateLastUpdated \\
\noalign{\hrule height 2pt}
\end{tabular}

\vspace{5mm}

\begin{tabular}{!{\vrule width 2pt}R{4cm}|L{11cm}!{\vrule width 2pt}}
\noalign{\hrule height 2pt}
Actors: & \show@actors \\\hline
Description: & \show@description \\\hline
Preconiditions: & \show@preconditions \\\hline
Postconditions: & \show@postconditions \\\hline
Priority: & \show@priority \\\hline
Frequency of Use: & \show@frequency \\\hline
Basic Flow: & \show@basicFlow \\\hline
\ifx\\\show@alternativeFlow\\
  Alternative Flow: & \show@alternativeFlow \\\hline
\fi
Exceptions: & \show@exceptions \\\hline
%Includes: &  \\\hline
Special Requirements: & \show@specialRequirements \\\hline
Assumptions: & \show@assumptions \\\hline
Notes and Issues: & \show@notes \\
\noalign{\hrule height 2pt}
\end{tabular}
}{%
}