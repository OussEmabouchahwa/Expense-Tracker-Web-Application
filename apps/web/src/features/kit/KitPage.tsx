import React, { useState } from "react";
import { Button } from "../../components/ui/Button.js";
import { IconButton } from "../../components/ui/IconButton.js";
import { Input } from "../../components/ui/Input.js";
import { Select } from "../../components/ui/Select.js";
import { Field } from "../../components/ui/Field.js";
import { AmountInput } from "../../components/ui/AmountInput.js";
import { StatusTag } from "../../components/ui/StatusTag.js";
import { Skeleton } from "../../components/ui/Skeleton.js";
import { EmptyState } from "../../components/ui/EmptyState.js";
import { PaceBar } from "../../components/charts/PaceBar.js";
import { Plus, Search } from "lucide-react";

export const KitPage: React.FC = () => {
  const [amount, setAmount] = useState(125000);

  return (
    <main className="max-w-[1120px] mx-auto px-4 md:px-10 py-8 pb-18 min-w-0">
      <h1 className="font-serif font-semibold text-[2rem] text-ledger-900 mb-2">
        Masrouf UI Kit Reference (`/__kit`)
      </h1>
      <p className="font-sans text-[0.9375rem] text-ledger-700 mb-8">
        Visual verification of every UI primitive and chart component against docs/DESIGN_SYSTEM.md.
      </p>

      {/* Buttons */}
      <section className="bg-paper-0 border border-line rounded-lg p-6 mb-6">
        <h2 className="font-serif text-[1.25rem] text-ledger-900 mb-4">Buttons</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-1.5" /> Primary Stamp
          </Button>
          <Button variant="secondary">Secondary Paper</Button>
          <Button variant="destructive">Destructive Loss</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="primary" disabled>Disabled</Button>
          <Button variant="primary" isLoading>Saving</Button>
          <IconButton aria-label="Search">
            <Search className="w-5 h-5" />
          </IconButton>
        </div>
      </section>

      {/* Status Tags */}
      <section className="bg-paper-0 border border-line rounded-lg p-6 mb-6">
        <h2 className="font-serif text-[1.25rem] text-ledger-900 mb-4">Status Tags</h2>
        <div className="flex flex-wrap items-center gap-3">
          <StatusTag variant="on_pace">On pace</StatusTag>
          <StatusTag variant="ahead">Ahead of pace</StatusTag>
          <StatusTag variant="over">Over by 36.500</StatusTag>
          <StatusTag variant="upcoming">Upcoming</StatusTag>
          <StatusTag variant="favorable">Favorable</StatusTag>
          <StatusTag variant="unfavorable">Unfavorable</StatusTag>
        </div>
      </section>

      {/* Form Controls */}
      <section className="bg-paper-0 border border-line rounded-lg p-6 mb-6">
        <h2 className="font-serif text-[1.25rem] text-ledger-900 mb-4">Form Controls & AmountInput</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
          <Field label="Amount Input (Large Serif 28)">
            {({ id }) => (
              <AmountInput
                id={id}
                valueMinor={amount}
                onChange={setAmount}
                currency="TND"
              />
            )}
          </Field>
          <Field label="Standard Input" hint="Helper explanation">
            {({ id }) => <Input id={id} placeholder="Enter text..." />}
          </Field>
          <Field label="Select Dropdown">
            {({ id }) => (
              <Select id={id}>
                <option>BIAT Courant</option>
                <option>Espèces</option>
              </Select>
            )}
          </Field>
          <Field label="Input with Error" error="This field is required">
            {({ id }) => <Input id={id} hasError defaultValue="Invalid value" />}
          </Field>
        </div>
      </section>

      {/* PaceBar States */}
      <section className="bg-paper-0 border border-line rounded-lg p-6 mb-6">
        <h2 className="font-serif text-[1.25rem] text-ledger-900 mb-4">PaceBar Progress Signature</h2>
        <div className="flex flex-col max-w-xl">
          <PaceBar
            categoryName="Courses & Alimentation (On Pace)"
            spentMinor={610000}
            limitMinor={750000}
            expectedFraction={0.9}
            status="ON_PACE"
            currency="TND"
            dayOfMonth={28}
            daysInMonth={31}
          />
          <PaceBar
            categoryName="Cafés & Sorties (Ahead of Pace)"
            spentMinor={172000}
            limitMinor={180000}
            expectedFraction={0.9}
            status="AHEAD"
            currency="TND"
            dayOfMonth={28}
            daysInMonth={31}
          />
          <PaceBar
            categoryName="Transport & Carburant (Over Budget)"
            spentMinor={245000}
            limitMinor={220000}
            expectedFraction={0.9}
            status="OVER"
            overByMinor={25000}
            currency="TND"
            dayOfMonth={28}
            daysInMonth={31}
          />
        </div>
      </section>

      {/* Empty State & Skeletons */}
      <section className="bg-paper-0 border border-line rounded-lg p-6">
        <h2 className="font-serif text-[1.25rem] text-ledger-900 mb-4">Empty State & Skeletons</h2>
        <EmptyState
          title="No transactions recorded"
          message="No transactions in this period. Add one now to start tracking."
          action={<Button variant="primary">Add transaction</Button>}
        />
        <div className="mt-4 flex flex-col gap-2">
          <Skeleton height={24} width="40%" />
          <Skeleton height={16} width="80%" />
          <Skeleton height={16} width="60%" />
        </div>
      </section>
    </main>
  );
};
